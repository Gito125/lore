export default function ArticleLoading() {
  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-8 pb-20" aria-busy="true" role="status">
      <div className="w-24 h-4 mb-4 bg-[rgba(255,255,255,0.05)] rounded animate-pulse" />
      
      <div className="space-y-4 mb-8">
        <div className="w-3/4 h-12 bg-[rgba(255,255,255,0.06)] rounded-lg animate-pulse" />
        <div className="w-1/2 h-12 bg-[rgba(255,255,255,0.06)] rounded-lg animate-pulse" />
      </div>

      <div className="w-full h-64 md:h-96 rounded-2xl mb-8 bg-[rgba(255,255,255,0.03)] animate-pulse border border-[rgba(255,255,255,0.03)]" />

      <div className="space-y-4">
        <div className="w-full h-4 bg-[rgba(255,255,255,0.04)] rounded animate-pulse" />
        <div className="w-full h-4 bg-[rgba(255,255,255,0.04)] rounded animate-pulse" />
        <div className="w-5/6 h-4 bg-[rgba(255,255,255,0.04)] rounded animate-pulse" />
        <div className="w-full h-4 bg-[rgba(255,255,255,0.04)] rounded animate-pulse" />
        <div className="w-4/5 h-4 bg-[rgba(255,255,255,0.04)] rounded animate-pulse" />
      </div>
    </div>
  );
}
