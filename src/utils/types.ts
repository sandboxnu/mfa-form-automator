export type Assignee = {
    name: string,
    signed: boolean,
  }
  
  export type Form = {
    name: string,
    assignees: Assignee[],
  }