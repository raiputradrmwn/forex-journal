import { JournalApp } from "@/components/features/journal/journal-app";
import { AppShell } from "@/components/layout/app-shell";

export default function Home() {
  return (
    <AppShell>
      <JournalApp />
    </AppShell>
  );
}
