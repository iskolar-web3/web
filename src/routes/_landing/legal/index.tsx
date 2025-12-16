import { Link } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute('/_landing/legal/')({
  component: Legal,
})

function Legal() {
    return (
        <div>
            <Link to="/">Legal</Link>
        </div>
    )
}