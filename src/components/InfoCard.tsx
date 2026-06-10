type Props = {
  label: string;
  value: string | number | undefined;
};

export default function InfoCard({
  label,
  value,
}: Props) {
  return (
    <div className="bg-slate-50 rounded-lg p-4">
      <p className="text-sm text-gray-500">
        {label}
      </p>

      <p className="font-semibold">
        {value || "-"}
      </p>
    </div>
  );
}