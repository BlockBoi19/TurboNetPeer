(function(Scratch) {
    'use strict';

    // Define the extension
    class TurboNetPeer {
        getInfo() {
            return {
                id: 'turbonetpeer',
                name: 'TurboNetPeer',
                blocks: [
                    // Multiplayer Blocks
                    {
                        opcode: 'connectToServer',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'connect to server [URL]',
                        arguments: {
                            URL: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'ws://localhost:8080'
                            }
                        }
                    },
                    {
                        opcode: 'sendMessage',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'send message [MESSAGE]',
                        arguments: {
                            MESSAGE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'Hello, world!'
                            }
                        }
                    },
                    {
                        opcode: 'onMessageReceived',
                        blockType: Scratch.BlockType.HAT,
                        text: 'when message received',
                    },
                    {
                        opcode: 'getMessage',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'received message'
                    },
                    {
                        opcode: 'disconnectFromServer',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'disconnect from server'
                    },
                    {
                        opcode: 'isConnected',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: 'is connected'
                    },
                    // UUID Label
                    {
                        blockType: Scratch.BlockType.LABEL,
                        text: 'UUID'
                    },
                    // UUID Blocks
                    {
                        opcode: 'generateUUID',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'generate UUID'
                    },
                    {
                        opcode: 'validateUUID',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: 'is [UUID] a valid UUID?',
                        arguments: {
                            UUID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
                            }
                        }
                    },
                    // JSON Label
                    {
                        blockType: Scratch.BlockType.LABEL,
                        text: 'JSON'
                    },
                    // JSON Blocks
                    {
                        opcode: 'parseJSON',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'parse JSON [STRING]',
                        arguments: {
                            STRING: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '{"key": "value"}'
                            }
                        }
                    },
                    {
                        opcode: 'stringifyJSON',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'stringify JSON [OBJECT]',
                        arguments: {
                            OBJECT: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '{"key": "value"}'
                            }
                        }
                    },
                    {
                        opcode: 'getJSONValue',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'get [KEY] from JSON [OBJECT]',
                        arguments: {
                            KEY: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'key'
                            },
                            OBJECT: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '{"key": "value"}'
                            }
                        }
                    },
                    {
                        opcode: 'setJSONValue',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'set [KEY] to [VALUE] in JSON [OBJECT]',
                        arguments: {
                            KEY: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'key'
                            },
                            VALUE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'value'
                            },
                            OBJECT: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '{"key": "value"}'
                            }
                        }
                    },
                    // User Password Label
                    {
                        blockType: Scratch.BlockType.LABEL,
                        text: 'User Password'
                    },
                    // User Password Blocks
                    {
                        opcode: 'setPassword',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'set password [PASSWORD]',
                        arguments: {
                            PASSWORD: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'password123'
                            }
                        }
                    },
                    {
                        opcode: 'checkPassword',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: 'check password [PASSWORD]',
                        arguments: {
                            PASSWORD: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'password123'
                            }
                        }
                    },
                    {
                        opcode: 'changePassword',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'change password from [OLD_PASSWORD] to [NEW_PASSWORD]',
                        arguments: {
                            OLD_PASSWORD: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'oldpassword'
                            },
                            NEW_PASSWORD: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'newpassword'
                            }
                        }
                    },
                    {
                        opcode: 'isPasswordSet',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: 'is password set?'
                    },
                    // Username Label
                    {
                        blockType: Scratch.BlockType.LABEL,
                        text: 'Username'
                    },
                    // Username Blocks
                    {
                        opcode: 'setUsername',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'set username [USERNAME]',
                        arguments: {
                            USERNAME: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'user123'
                            }
                        }
                    },
                    {
                        opcode: 'getUsername',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'get username'
                    },
                    {
                        opcode: 'checkUsername',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: 'check username [USERNAME]',
                        arguments: {
                            USERNAME: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'user123'
                            }
                        }
                    }
                ],
                menus: {}
            };
        }

        // Multiplayer Functions
        connectToServer(args) {
            this.socket = new WebSocket(args.URL);
            this.socket.onmessage = (event) => {
                this.receivedMessage = event.data;
                Scratch.vm.runtime.startHats('turbonetpeer_onMessageReceived');
            };
        }

        sendMessage(args) {
            if (this.socket && this.socket.readyState === WebSocket.OPEN) {
                this.socket.send(args.MESSAGE);
            }
        }

        getMessage() {
            return this.receivedMessage || '';
        }

        disconnectFromServer() {
            if (this.socket) {
                this.socket.close();
            }
        }

        isConnected() {
            return this.socket && this.socket.readyState === WebSocket.OPEN;
        }

        // UUID Functions
        generateUUID() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        }

        validateUUID(args) {
            const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
            return uuidRegex.test(args.UUID);
        }

        // JSON Functions
        parseJSON(args) {
            try {
                return JSON.parse(args.STRING);
            } catch (e) {
                return 'Invalid JSON';
            }
        }

        stringifyJSON(args) {
            try {
                return JSON.stringify(args.OBJECT);
            } catch (e) {
                return 'Invalid Object';
            }
        }

        getJSONValue(args) {
            try {
                const obj = JSON.parse(args.OBJECT);
                return obj[args.KEY];
            } catch (e) {
                return 'Invalid JSON';
            }
        }

        setJSONValue(args) {
            try {
                const obj = JSON.parse(args.OBJECT);
                obj[args.KEY] = args.VALUE;
                return JSON.stringify(obj);
            } catch (e) {
                return 'Invalid JSON';
            }
        }

        // User Password Functions
        setPassword(args) {
            this.password = args.PASSWORD;
        }

        checkPassword(args) {
            return this.password === args.PASSWORD;
        }

        changePassword(args) {
            if (this.password === args.OLD_PASSWORD) {
                this.password = args.NEW_PASSWORD;
            }
        }

        isPasswordSet() {
            return !!this.password;
        }

        // Username Functions
        setUsername(args) {
            this.username = args.USERNAME;
        }

        getUsername() {
            return this.username || '';
        }

        checkUsername(args) {
            return this.username === args.USERNAME;
        }
    }

    // Register the extension
    Scratch.extensions.register(new TurboNetPeer());
})(Scratch);
