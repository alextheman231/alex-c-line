let pendingUpdateMessage: string | null = null;
let registered = false;

export function setPendingUpdateMessage(message: string): void {
  pendingUpdateMessage = message;
}

export function registerUpdateMessagePrinter(): void {
  if (registered) {
    return;
  }
  registered = true;

  function print() {
    if (pendingUpdateMessage) {
      console.info(`\n${pendingUpdateMessage}`);
      pendingUpdateMessage = null;
    }
  }

  process.once("beforeExit", print);
  process.once("exit", print);
}
