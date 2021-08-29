import { contacts, messages } from './model';
import { logging } from "near-sdk-as";

export function addPhone(text: string): void {
  const message = new contacts(text);
  messages.push(message);
  logging.log("Add new contact successfully");
}

export function deletePhone(index: i32): void {
  messages.swap_remove(index)
  logging.log("Delete new contact successfully");
}

export function getAllPhone(): contacts[] {
  const result = new Array<contacts>(messages.length);
  for(let i = 0; i < messages.length; i++) {
    result[i] = messages[i];
  }
  logging.log("Get all contact successfully");
  return result;
}
