export interface InternalProofItem {
  title: string;
  cost: number;
}

export interface InternalProof {
  issueDate: Date;
  items: InternalProofItem[];
}
