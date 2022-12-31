import * as React from "react";

import Layout from "../../components/Layout";
import ListRoll from "../../components/ListRoll";

export default class BlogIndexPage extends React.Component {
  render() {
    return (
      <Layout>
        <section className="section">
          <div className="container">
            <div className="content">
              <ListRoll />
            </div>
          </div>
        </section>
      </Layout>
    );
  }
}
