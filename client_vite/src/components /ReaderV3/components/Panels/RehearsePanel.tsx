import { useFormikContext } from "formik";
import { Actor, Scene } from "../../reader.types";
import { useReaderContext } from "../../contexts/ReaderContext";
import Wrapper from "../../../../layout/Wrapper";

import SelectList from "../../../SelectList";
import Dropdown from "../../../common/Dropdown";
import { Link } from "@tanstack/react-router";

const RehearsePanel = () => {
  const { values } = useFormikContext<Scene>();
  const { options, dispatch } = useReaderContext();

  const uniqueActors = [
    ...new Set(values.data.map((line) => line.name || line.type)),
  ].filter((item) => !["EXT", "INT"].includes(item.toUpperCase()));

  
 return (
  <div className="flex flex-row sm:items-center justify-between md:gap-4 w-full">
    {/* Actors Dropdown */}
    <Dropdown title="Actors" className="w-full sm:w-auto">
      <Wrapper>
        <SelectList
          labels={uniqueActors.map((actor) => ({
            label: actor,
            value: actor === "INFO" ? "" : actor,
          }))}
          initialValues={options.highlight.map(
            (actor: Actor) => actor.id || ""
          )}
          onCheck={(label) =>
            dispatch({
              type: "HIGHLIGHT_TARGET",
              payload: { target: label },
            })
          }
        />
      </Wrapper>
    </Dropdown>

    {/* Link as Button */}
    <Wrapper>
      <Link
        to={`/markdown-edit/{-$id}`}
          search={{
            redirect: `${encodeURIComponent(location.pathname)}`
          }}
        className="inline-block bg-blue-600 text-white font-medium px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-center w-full sm:w-auto"
      >
        Edit
      </Link>
    </Wrapper>
  </div>
);
};

export default RehearsePanel;
