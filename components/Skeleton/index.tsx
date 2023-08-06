import AdminOverviewSkeleton from "./AdminOverview";
import ProjectDetailOverviewSkeleton, { ProjectDetailEpisodeSkeleton } from "./ProjectDetailOverview";
import ProjectOverviewSkeleton, { ProjectOverviewSingleSkeleton } from "./ProjectOverview";
import RSSEmbedEditorSkeleton from "./RSSEmbedEditor";
import RSSSampleSkeleton from "./RSSSample";
import StatsCardSkeleton from "./StatsCard";

const SkeletonLoader = {
    AdminOverview: AdminOverviewSkeleton,
    ProjectSingle: ProjectOverviewSingleSkeleton,
    ProjectOverview: ProjectOverviewSkeleton,
    ProjectDetail: ProjectDetailOverviewSkeleton,
    ProjectEpisode: ProjectDetailEpisodeSkeleton,
    StatsCard: StatsCardSkeleton,
    RSSEditor: RSSEmbedEditorSkeleton,
    RSSSample: RSSSampleSkeleton,
};

export default SkeletonLoader;
