let pendingUpdateMessage: string | null = null;
let registered = false;

export function setPendingUpdateMessage(message: string): void {
  pendingUpdateMessage = message;
}

function print() {
  if (pendingUpdateMessage) {
    console.info(`\n${pendingUpdateMessage}`);
    pendingUpdateMessage = null;
  }
}

export function registerUpdateMessagePrinter(): void {
  if (registered) {
    return;
  }
  registered = true;

  process.once("beforeExit", print);
  process.once("exit", print);
}
