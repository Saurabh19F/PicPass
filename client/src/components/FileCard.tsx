interface FileCardProps {
    fileName: string;
    fileType: string;
    fileSize: number;
}

export default function FileCard({ fileName, fileType, fileSize }: FileCardProps) {
    return (
        <div className="p-3 bg-white rounded shadow border">
            <p className="font-semibold">{fileName}</p>
            <p className="text-sm text-gray-600">{fileType} — {Math.round(fileSize / 1024)} KB</p>
        </div>
    );
}
