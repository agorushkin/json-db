export class JSONDB<T = unknown> {
  data: T;
  path: string;

  constructor(path: string, base?: T) {
    this.data = base as T;
    this.path = path;
  }

  read = async () => {
    const file = await Deno.readTextFile(this.path);
    const json = JSON.parse(file);

    this.data = { ...this.data, ...json } as T;
  };

  write = async () => {
    const data = JSON.stringify(this.data);
    const status = await Deno.writeTextFile(`${ this.path }.tmp`, data)
      .then(() => true)
      .catch(() => false);

    return status;
  };

  commit = async () => {
    const status = await Deno.rename(`${ this.path }.tmp`, this.path)
      .then(() => true)
      .catch(() => false);

    return status;
  };
}
