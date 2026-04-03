interface ServiceStatusBannerProps {
  message: string;
}

export function ServiceStatusBanner({ message }: ServiceStatusBannerProps) {
  return (
    <div className="rounded-[24px] border border-amber-300 bg-amber-50 px-5 py-4 text-sm text-amber-900">
      <p className="font-semibold uppercase tracking-[0.16em]">Connection warning</p>
      <p className="mt-2">{message}</p>
    </div>
  );
}
