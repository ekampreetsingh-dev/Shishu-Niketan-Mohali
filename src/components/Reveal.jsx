import { motion, useReducedMotion } from "motion/react";

// With reduce-motion enabled the content still fades in, it simply stops
// travelling — hiding the entrance entirely makes sections read as broken.
export default function Reveal({ children, delay = 0, y = 18, as = "div", className, ...rest }) {
  const reduced = useReducedMotion();
  const Base = motion[as] ?? motion.div;

  return (
    <Base
      className={className}
      initial={{ opacity: 0, y: reduced ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2, margin: "0px 0px -8% 0px" }}
      transition={{ duration: reduced ? 0.2 : 0.6, delay: reduced ? 0 : delay, ease: [0.22, 0.61, 0.36, 1] }}
      {...rest}
    >
      {children}
    </Base>
  );
}
