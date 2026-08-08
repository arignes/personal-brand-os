import CalendarPost from "@/components/CalendarPost";
import EmptyBrand from "@/components/EmptyBrand";
import { getActiveBrand } from "@/lib/active-brand";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const SLOTS = [1, 3, 5]; // schedule posts on Tue / Thu / Sat
const TIMES = ["09:00", "12:30", "10:00"];

export default async function CalendarPage() {
  const brand = await getActiveBrand();
  if (!brand) return <EmptyBrand what="calendar" />;
  const posts = brand.result.samplePosts;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
          calendar · this week
        </p>
        <h1 className="mt-1 font-serif text-3xl text-ink">
          Your first week <span className="sparkle text-xl">✦</span>
        </h1>
        <p className="mt-1.5 text-sm text-muted">
          A starter cadence from your plan. Move things around as you go.
        </p>
      </div>

      <div className="flex flex-col gap-2.5">
        {DAYS.map((day, di) => {
          const slot = SLOTS.indexOf(di);
          const post = slot >= 0 ? posts[slot % posts.length] : undefined;
          return (
            <div key={day} className="card-glass rounded-2xl p-4">
              <div className="flex items-baseline justify-between">
                <p className="font-serif text-lg text-ink">{day}</p>
                {!post && <span className="text-xs text-faint">rest day</span>}
              </div>
              {post && <CalendarPost time={TIMES[slot] ?? "10:00"} post={post} />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
