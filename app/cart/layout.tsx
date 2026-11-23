export const metadata = {
  title: "Your cart",
  description: "Review your TickTail order.",
};

export default function CartLayout({ children }: LayoutProps<"/cart">) {
  return children;
}
