'use strict'

const config = require('config')
const crypto = require('crypto')
const net = require('net')

const { JSONparse, JSONstringify, log } = require('./utils.js')
const ConnectionStore = require('./ConnectionStore.js')
const ConnectionHandler = require('./ConnectionHandler.js')

// If a configuration file does not contain a value 
// for a given property, get() will throw an exception.
// (https://github.com/lorenwest/node-config/wiki/Common-Usage)
const { host: HOST, port: PORT } = config.get('Server')
const { banner } = config.get('Server')
const { MsgType } = config.get('Constants')


class Server extends ConnectionStore {
    constructor(port = PORT, host = HOST) {
        super(port, host)
        this.port = port
        this.host = host
        this.server = net.createServer()
        this.handleConnection = this.handleConnection.bind(this)
        this.handleServerError = this.handleServerError.bind(this)
        this.start()
    }

    start() {
        this.server
            .on('connection', this.handleConnection)
            .on('error', this.handleServerError)
            .listen(this.port, this.host, () => {
                this.address = `${this.server.address().address}:${this.port}`
                log.info(`Server listening on ${this.address}`);    
            })
    }

    /**
     * Initial connection handler/listener. Activated
     * when the server emits a 'connection' event.
     * 
     * @param {*} socket 
     */
    handleConnection(socket) {
        log.important(`Join request from ${this.address}`);
        
        const id = this.append(socket)

        const msg = JSONstringify({ 
            type: MsgType.INIT,
            timestamp: Date.now(),
            banner: banner,
            id: id,
            clients: this.without(id)
        })
    
        if (Object.is(msg, undefined)) {
            log.error(error, `Failed to add a new client [${this.address}]`)
            handleSocketEnd()
            return            
        }
    
        this.send(this.serverId, id, msg)
        log.emph(`New client ${id} [${this.address}]`);
        this.print()


        const connectionHandler = new ConnectionHandler(this, socket);
        socket.on('data', data => connectionHandler.handleData(data))
        socket.on('error', error => connectionHandler.handleError(error))
        socket.on('end', () => connectionHandler.handleEnd())
        socket.on('close', () => connectionHandler.handleClose())   
    }

    /**
     * Listener for server 'error' events.
     * 
     * @param {*} error 
     */
    handleServerError(error) {
        log.error(error, `Server error [${this.address}]`)
    }
}


module.exports = Server