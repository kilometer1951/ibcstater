import EventEmitter from 'events';
import { isNullOrUndefined } from '../../data/validators';
import Redis from 'redis';
import { LOG_LEVEL_DEBUG, LOG_LEVEL_ERROR, LOG_LEVEL_INFO } from '../../constants/log-levels';

/**
 * @typedef {import("redis").RedisClient} RedisClient
 * @typedef {import("redis").ClientOpts} RedisClientOptions
 * @typedef {import("winston").Logger} WinstonLogger
 */

/**
 * Establishes an Redis connection
 * @param {string} identifier
 * @param {string} host
 * @param {number} port
 * @param {RedisClientOptions} options
 * @param {WinstonLogger} logger
 * @returns {PromiseLike.<CacheProvider>}
 */
export default function connect(identifier, host, port, options, logger) {
    return new Promise((resolve, reject) => {
        const cacheProvider = new CacheProvider(identifier, host, port, options, logger);
        const connectionErrorHandler = () => {
            cacheProvider.removeListener('ready', connectionReadyHandler);
            reject(new Error('An error occurred while connecting.'));
        }, connectionReadyHandler = () => {
            cacheProvider.removeListener('error', connectionErrorHandler);
            resolve(cacheProvider);
        };
        cacheProvider.once('ready', connectionReadyHandler);
        cacheProvider.once('error', connectionErrorHandler);
        cacheProvider.connect();
    });
}

/**
 * Redis Cache Provider
 */
export class CacheProvider extends EventEmitter {
    /**
     * Creates a new Provider
     */
    constructor(identifier, host, port, options, logger, logLabel = 'Cache') {
        super();
        this._identifier = identifier;
        this._host = host;
        this._port = port;
        this._options = options;
        this._logger = logger;
        this._logLabel = logLabel;

        this._redisClient = null;
        this._isConnected = false;
        this._isReady = false;
        this._stores = new Map();
    }

    get isConnected() {
        return this._isConnected;
    }

    get isReady() {
        return this._isReady;
    }

    get Stores() {
        return this._stores;
    }

    get RedisClient() {
        return this._redisClient;
    }

    /**
     * Attempts to connect the redis instance. Commands are queued till the connection is successful and client is ready.
     */
    connect() {
        this._redisClient = Redis.createClient(
            this._port,
            this._host,
            this._options
        );

        this._redisClient.on('ready', this._onClientReady.bind(this));
        this._redisClient.on('connect', this._onClientConnect.bind(this));
        this._redisClient.on('reconnecting', this._onClientReconnecting.bind(this));
        this._redisClient.on('error', this._onClientError.bind(this));
        this._redisClient.on('end', this._onClientEnd.bind(this));
    }

    /**
     * Attempts to cleanly terminate Redis connection after all running commands were properly handled.
     */
    close() {
        if (this._redisClient) {
            this._redisClient.quit((error, result) => {
                if (error) {
                    this._logger.log({ level: LOG_LEVEL_ERROR, label: this._logLabel, message: 'An error occurred while closing cache provider.', error });
                } else {
                    this._logger.log({ level: LOG_LEVEL_INFO, label: this._logLabel, message: 'Provider successfully closed.', data: result });
                }
            });
        }
    }

    /**
     * Creates a cache store. If a store with same name already exists, its returns the existing instance. A cache store works as a container for related cache entries.
     * @param {String} name Name of the store. The name is also used to generate unique keys for cache entries. All stores must have unique names.
     * @param {{expire: number}} cachePolicy Cache policy. Use expire property to set TTL in seconds for all entries in the store.
     * @returns {CacheStore} A cache store.
     */
    createStore(storeName, cachePolicy = { expire: 3600 }) {
        const storeIdentifier = `urn:${this._identifier}:${storeName}`;
        if (this.Stores.has(storeIdentifier)) {
            return this.Stores.get(storeIdentifier);
        } else {
            const newStore = new CacheStore(this.RedisClient, storeIdentifier, cachePolicy, this._logger, this._logLabel);
            this.Stores.set(storeIdentifier, newStore);
            return newStore;
        }
    }

    _onClientReady() {
        this._isConnected = true;
        this._isReady = true;
        this._logger.log({ level: LOG_LEVEL_INFO, label: this._logLabel, message: 'Provider is ready.' });
        this.emit('ready', this._redisClient);
    }
    _onClientConnect() {
        this._isConnected = true;
        this._isReady = false;
        this._logger.log({ level: LOG_LEVEL_INFO, label: this._logLabel, message: 'Provider connected to Redis.' });
        this.emit('connect', this._redisClient);
    }
    _onClientReconnecting({ delay, attempt, error }) {
        this._isConnected = false;
        this._isReady = false;
        this._logger.log({ level: LOG_LEVEL_ERROR, label: this._logLabel, message: `Provider disconnected. Attempting to reconnect #${attempt} ${delay} ms.`, error });
        this.emit('reconnecting', delay, attempt, error);
    }
    _onClientError() {
        this._isConnected = false;
        this._isReady = false;
        this._logger.log({ level: LOG_LEVEL_ERROR, message: 'Provider encountered an error.' });
        this.emit('error');
    }
    _onClientEnd() {
        this._isConnected = false;
        this._isReady = false;
        this._logger.log({ level: LOG_LEVEL_INFO, label: this._logLabel, message: 'Provider closed connection with Redis.' });
        this.emit('end');
    }
}

/**
 * A container for related cache entries.
 */
class CacheStore {
    /**
     *
     * @param {RedisClient} redisClient
     * @param {string} identifier
     * @param {object} policy
     * @param {WinstonLogger} logger
     */
    constructor(redisClient, identifier, policy, logger, logLabel) {
        this._redisClient = redisClient;
        this._identifier = identifier;
        this._policy = policy;
        this._logger = logger;
        this._logLabel = logLabel;
    }

    get RedisClient() {
        return this._redisClient;
    }

    get Identifier() {
        return this._identifier;
    }

    /**
     * Inserts a cache entry into the cache. If the specified entry does not exist in the cache, a new cache entry is inserted. If the specified entry already exists, its value is updated.
     * @param {string} key A unique identifier for the cache entry.
     * @param {*} value The value to store in the cache.
     * @returns {PromiseLike.<string>}
     */
    set(key, value) { //eslint-disable-line id-length
        return new Promise((resolve, reject) => {
            const optionsArgs = ['EX', this._policy.expire];
            this._logger.log({ level: LOG_LEVEL_DEBUG, label: this._logLabel, message: `SET ${this.Identifier}:${key} Expires: ${this._policy.expire}s.` });
            this.RedisClient.set(`${this.Identifier}:${key}`, JSON.stringify(value), ...optionsArgs, (error, result) => {
                if (error) {
                    this._logger.log({ level: LOG_LEVEL_ERROR, label: this._logLabel, message: `SET Error ${this.Identifier}:${key}`, error });
                    reject(error);
                } else {
                    resolve(result);
                }
            });
        });
    }

    /**
     * Inserts multiple cache entry into the cache. If any entry does not exist in the cache, a new cache entry is inserted, else its value is updated.
     * @param {Array.<Array.<>>} values An array of key value pairs arranged as [[key, value], [key, value], ...]
     * @returns {PromiseLike.<string>}
     */
    setMany(values) {
        return new Promise((resolve, reject) => {
            if (values.length > 0) {
                const namespacedValues = [].concat(
                    ...values.map(
                        ([key, value]) => [`${this.Identifier}:${key}`, JSON.stringify(value)]
                    )
                );
                this._logger.log({ level: LOG_LEVEL_DEBUG, label: this._logLabel, message: 'SET MANY', data: namespacedValues });
                this.RedisClient.mset(...namespacedValues, (error, result) => {
                    if (error) {
                        this._logger.log({ level: LOG_LEVEL_ERROR, label: this._logLabel, message: 'SET MANY Error', error });
                        reject(error);
                    } else {
                        resolve(result);
                    }
                });
            } else {
                resolve();
            }
        });
    }

    /**
     * Gets an entry from the cache. If the entry doesn't exists returns null.
     * @param {*} key The unique identifier for the cache entry.
     * @returns {PromiseLike.<object>}
     */
    get(key) { //eslint-disable-line id-length
        return new Promise((resolve, reject) => {
            this._logger.log({ level: LOG_LEVEL_DEBUG, label: this._logLabel, message: `GET ${this.Identifier}:${key}` });
            this.RedisClient.get(`${this.Identifier}:${key}`, (error, result) => {
                if (error) {
                    this._logger.log({ level: LOG_LEVEL_ERROR, label: this._logLabel, message: `GET Error ${this.Identifier}:${key}`, error });
                    reject(error);
                } else {
                    resolve(JSON.parse(result));
                }
            });
        });
    }

    /**
     * Gets many entries from the cache. If an entry doesn't exists returns null.
     * @param {Array.<string>} keys List of keys.
     * @returns {PromiseLike.<Array.<object>>}
     */
    getMany(keys) {
        return new Promise((resolve, reject) => {
            if (keys.length > 0) {
                const namespacedKeys = keys.map(key => `${this.Identifier}:${key}`);
                this._logger.log({ level: LOG_LEVEL_DEBUG, label: this._logLabel, message: 'GET MANY', data: namespacedKeys });
                this.RedisClient.mget(namespacedKeys, (error, result) => {
                    if (error) {
                        this._logger.log({ level: LOG_LEVEL_ERROR, label: this._logLabel, message: 'GET MANY Error', error });
                        reject(error);
                    } else {
                        resolve(result.map(value => JSON.parse(value)));
                    }
                });
            } else {
                resolve([]);
            }
        });
    }

    /**
     * Checks if and entry with the key exists in cache.
     * @param {*} key The unique identifier for the cache entry.
     * @returns {PromiseLike.<boolean>}
     */
    exists(key) {
        return new Promise((resolve, reject) => {
            this._logger.log({ level: LOG_LEVEL_DEBUG, label: this._logLabel, message: `EXISTS ${this.Identifier}:${key}` });
            this.RedisClient.exists(`${this.Identifier}:${key}`, (error, result) => {
                if (error) {
                    this._logger.log({ level: LOG_LEVEL_ERROR, label: this._logLabel, message: `EXISTS Error ${this.Identifier}:${key}`, error });
                    reject(error);
                } else {
                    resolve(result > 0);
                }
            });
        });
    }

    /**
     * Removes an entry from cache.
     * @param {string} key The unique identifier for the cache entry.
     * @returns {PromiseLike.<number>}
     */
    remove(key) {
        return new Promise((resolve, reject) => {
            this._logger.log({ level: LOG_LEVEL_DEBUG, label: this._logLabel, message: `DEL ${this.Identifier}:${key}` });
            this.RedisClient.del(`${this.Identifier}:${key}`, (error, result) => {
                if (error) {
                    this._logger.log({ level: LOG_LEVEL_ERROR, label: this._logLabel, message: `DEL Error ${this.Identifier}:${key}`, error });
                    reject(error);
                } else {
                    resolve(result);
                }
            });
        });
    }

    /**
     * Removes multiple entries from cache.
     * @param {Array.<string>} keys List of keys.
     * @returns {PromiseLike.<number>}
     */
    removeMany(keys) {
        return new Promise((resolve, reject) => {
            if (keys.length > 0) {
                const namespacedKeys = keys.map(key => `${this.Identifier}:${key}`);
                this._logger.log({ level: LOG_LEVEL_DEBUG, label: this._logLabel, message: 'DEL MANY', data: namespacedKeys });
                this.RedisClient.del(namespacedKeys, (error, result) => {
                    if (error) {
                        this._logger.log({ level: LOG_LEVEL_ERROR, label: this._logLabel, message: 'DEL MANY Error', error });
                        reject(error);
                    } else {
                        resolve(result);
                    }
                });
            } else {
                resolve();
            }
        });
    }

    keys() {
        return new Promise((resolve, reject) => {
            this._logger.log({ level: LOG_LEVEL_DEBUG, label: this._logLabel, message: `KEYS ${this.Identifier}` });
            this.RedisClient.keys(`${this.Identifier}:*`, (error, result) => {
                if (error) {
                    this._logger.log({ level: LOG_LEVEL_ERROR, label: this._logLabel, message: `KEYS Error ${this.Identifier}`, error });
                    reject(error);
                } else {
                    resolve(result);
                }
            });
        });
    }

    clear() {
        return new Promise((resolve, reject) => {
            this._logger.log({ level: LOG_LEVEL_DEBUG, label: this._logLabel, message: `CLEAR ${this.Identifier}` });
            this.RedisClient.keys(`${this.Identifier}:*`, (error, keys) => {
                if (error) {
                    reject(error);
                } else {
                    if (keys.length > 0) {
                        this.RedisClient.del(keys, (error, result) => {
                            if (error) {
                                reject(error);
                            } else {
                                resolve(result);
                            }
                        });
                    } else {
                        resolve(0);
                    }
                }
            });
        });
    }
}

/**
 * Gets from cache if the entry exists else gets from Source
 * @param {CacheStore} cacheStore
 * @param {string} key
 * @param {Function} getFromSource
 */
export async function getFromCacheOrSource(cacheStore, key, getFromSource) {
    const cacheEntryExists = await cacheStore.exists(key);
    if (cacheEntryExists) {
        return await cacheStore.get(key);
    } else {
        const dataFromSource = await getFromSource(key);
        if (!isNullOrUndefined(dataFromSource)) {
            await cacheStore.set(key, dataFromSource);
        }
        return dataFromSource;
    }
}
