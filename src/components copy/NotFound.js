import { Link } from "react-router-dom";
import PageTitle from "./PageTitle";

export default function NotFound() {
  return (
    <PageTitle title="Page Not Fount">
      <div className="text-center">
        <h1>Page Not Found (404)</h1>
        <p className="lead text-muted">
          Sorry Page not found You can go back to <Link to="/">Home Page</Link>
        </p>
      </div>
    </PageTitle>
  );
}
