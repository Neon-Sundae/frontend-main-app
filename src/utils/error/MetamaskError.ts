/* eslint-disable import/prefer-default-export */

interface IData {
  code: number;
  message: string;
}

interface IMetamaskError {
  code: number | string;
  data: IData | undefined;
  message: string;
  // stack: string;
}

export class MetamaskError extends Error {
  public readonly code: number | string;

  public readonly data: IData | undefined;

  // base constructor only accepts string message as an argument
  // we extend it here to accept an object, allowing us to pass other data
  constructor({ code, data, message }: IMetamaskError) {
    super(message);
    // super(stack);
    this.code = code;
    this.data = data;
  }
}
