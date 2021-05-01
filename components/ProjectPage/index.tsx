import AliasComponent from "./AliasComponent";
import EpisodeComponent from "./EpisodeComponent";
import NukeProjectComponent from "./NukeComponent";
import StaffComponent from "./StaffComponent";

const ProjectPageComponent = {
    Aliases: AliasComponent,
    Deletion: NukeProjectComponent,
    Episode: EpisodeComponent,
    Staff: StaffComponent,
};

export default ProjectPageComponent;
