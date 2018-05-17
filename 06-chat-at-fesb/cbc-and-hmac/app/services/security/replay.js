const DEFAULTS = {
    messageValidityInSeconds: 2
}

const isReplayAttack = ({ messageSendTime, messageValidityInSeconds } = DEFAULTS) =>
    messageSendTime + messageValidityInSeconds*1000 >= Date.now();

export { isReplayAttack }
