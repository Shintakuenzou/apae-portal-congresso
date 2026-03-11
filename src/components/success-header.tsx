import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

interface SuccessHeaderProps {
  title: string;
  subtitle: string;
  email?: string;
}

export function SuccessHeader({ title, subtitle, email }: SuccessHeaderProps) {
  return (
    <div className="text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-accent/10"
      >
        <CheckCircle2 className="h-10 w-10 text-green-900" />
      </motion.div>
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-3xl font-bold tracking-tight md:text-4xl text-balance"
      >
        {title}
      </motion.h1>
      <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-3 text-muted-foreground text-pretty">
        {subtitle}
      </motion.p>
      {email && (
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-2 text-sm text-muted-foreground">
          E-mail cadastrado: <span className="font-medium">{email}</span>
        </motion.p>
      )}
    </div>
  );
}
