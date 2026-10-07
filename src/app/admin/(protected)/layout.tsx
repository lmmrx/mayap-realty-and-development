import { ReactNode } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { getUnreadInquiryCount } from "@/data/inquiries";

export default function AdminProtectedLayout({ children }: { children: ReactNode }) {
  const unreadInquiries = getUnreadInquiryCount();

  return <AdminShell unreadInquiries={unreadInquiries}>{children}</AdminShell>;
}
