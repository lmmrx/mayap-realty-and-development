import crypto from "node:crypto";
import { revalidatePath } from "next/cache";
import { readJsonFile, writeJsonFile } from "@/lib/json-store";
import { Inquiry } from "@/lib/types";

const DATA_PATH = "inquiries.json";

function readInquiries(): Inquiry[] {
  return readJsonFile<Inquiry[]>(DATA_PATH, []);
}

function writeInquiries(inquiries: Inquiry[]): void {
  writeJsonFile(DATA_PATH, inquiries);
}

function revalidateInquiryPaths() {
  // The unread count badge renders in the shared admin layout, so every
  // admin page under it needs busting, not just the inquiries page itself.
  revalidatePath("/admin", "layout");
}

export function getAllInquiries(): Inquiry[] {
  return readInquiries().sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export function getUnreadInquiryCount(): number {
  return readInquiries().filter((inquiry) => !inquiry.read).length;
}

export function createInquiry(input: {
  name: string;
  phone: string;
  email: string;
  message: string;
  property?: string;
}): Inquiry {
  const inquiries = readInquiries();
  const inquiry: Inquiry = {
    id: crypto.randomUUID(),
    name: input.name,
    phone: input.phone,
    email: input.email,
    message: input.message,
    property: input.property,
    createdAt: new Date().toISOString(),
    read: false,
  };

  writeInquiries([inquiry, ...inquiries]);
  revalidateInquiryPaths();
  return inquiry;
}

export function markInquiryRead(id: string): void {
  const inquiries = readInquiries();
  const next = inquiries.map((inquiry) => (inquiry.id === id ? { ...inquiry, read: true } : inquiry));
  writeInquiries(next);
  revalidateInquiryPaths();
}

export function deleteInquiry(id: string): void {
  const inquiries = readInquiries();
  writeInquiries(inquiries.filter((inquiry) => inquiry.id !== id));
  revalidateInquiryPaths();
}
