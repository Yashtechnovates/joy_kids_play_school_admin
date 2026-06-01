import { motion } from 'framer-motion';

const FacilityCard = ({ icon: Icon, title, description, color }) => {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all cursor-pointer"
    >
      <div className={`p-3 rounded-xl bg-gradient-to-br ${color} text-white w-fit mb-4`}>
        <Icon size={28} />
      </div>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-500 text-sm">{description}</p>
    </motion.div>
  );
};

export default FacilityCard;