import { motion } from 'framer-motion';

const Card = ({ children, className = '', hover = true, onClick, title, icon: Icon }) => {
  return (
    <motion.div
      whileHover={hover ? { y: -5, transition: { duration: 0.2 } } : {}}
      className={`bg-white rounded-2xl shadow-lg overflow-hidden ${hover ? 'hover:shadow-xl transition-all duration-300' : ''} ${className}`}
      onClick={onClick}
    >
      {Icon && (
        <div className="p-4 bg-gradient-to-br from-primary-500 to-primary-600">
          <Icon size={32} className="text-white" />
        </div>
      )}
      {title && <div className="p-4 border-b border-gray-100"><h3 className="text-lg font-semibold text-gray-800">{title}</h3></div>}
      <div className="p-4">{children}</div>
    </motion.div>
  );
};

export default Card;