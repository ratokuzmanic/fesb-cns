const messageValidityInSeconds = 1;

const isReplayAttack = (messageSendTime) =>    
    messageSendTime + messageValidityInSeconds*1000 <= Date.now();

export { isReplayAttack }
