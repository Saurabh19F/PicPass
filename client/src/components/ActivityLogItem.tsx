interface ActivityLogItemProps {
  action: string;
  timestamp: string;
  ipAddress: string;
}

export default function ActivityLogItem({
  action,
  timestamp,
  ipAddress,
}: ActivityLogItemProps) {
  return (
    <li className="text-sm text-gray-900 dark:text-gray-300 leading-relaxed">
      <span className="font-semibold text-gray-900 dark:text-white">{action}</span> –{" "}
      <span className="text-gray-800 dark:text-gray-400">{timestamp}</span> from{" "}
      <a
        href={`http://${ipAddress}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-700 dark:text-blue-400 hover:underline hover:text-blue-900 dark:hover:text-blue-300"
      >
        {ipAddress}
      </a>
    </li>
  );
}
