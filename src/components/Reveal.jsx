// Reveal is now a plain wrapper: entrance animations are handled globally with
// GSAP + ScrollTrigger (see src/animations/premiumMotion.js).
export default function Reveal({ children, className = '', as: Tag = 'div', ...rest }) {
  return (
    <Tag className={className} {...rest}>
      {children}
    </Tag>
  )
}
