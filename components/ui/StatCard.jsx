const StatCard = ({ icon, value, label, iconBgColor }) => {
  return (
    <div className="flex flex-col items-start gap-4 rounded-2xl bg-white p-4 w-full min-w-0 shadow-sm">
      <div>
        <p className="text-sm text-tms-gray-20">{label}</p>
      </div>
      <div className="flex items-center gap-4">
        <div className={`flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full ${iconBgColor}`}>
          {icon}
        </div>
        <div className="min-w-0">
          <h3 className="text-2xl md:text-4xl font-bold text-[#014023] truncate">{value}</h3>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
