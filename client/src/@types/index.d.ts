//define type for a function setting ANY state (cant bring any of these to work - why?)
// type SetState<T> = (value: T | null) => void;
// type SetState<T> = React.Dispatch<React.SetStateAction<T | null>>;

type props = {
  children: React.ReactNode
}

interface SubmitLoginData {
  email: string,
  password: string,
}

interface Chat {
  title: string,
  _id: string;
  history?: Dialogue[]
}


interface Dialogue {
  prompt: string,
  response: string,
  temp: number,
  topP: number,
  promptTokens: number,
  responseTokens: number,
  totalTokens: number,
  inContext: boolean,
}

interface Status {
  status: "idle" | "loading" | "success" | "error";
}


interface PromptMode {
  name: string,
  temp: number,
  topP: number,
}



interface Persona {
  name: string,
  message: string
}