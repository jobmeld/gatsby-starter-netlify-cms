import React from "react";
import PropTypes from "prop-types";
import { kebabCase } from "lodash";
import { Helmet } from "react-helmet";
import { graphql, Link } from "gatsby";
import Layout from "../components/Layout";
import Content, { HTMLContent } from "../components/Content";

// eslint-disable-next-line
export const ListPostTemplate = ({
  content,
  contentComponent,
  description,
  tags,
  title,
  helmet,
}) => {
  const PostContent = contentComponent || Content;

  return (
    <section className="section">
      {helmet || ""}
      <div className="container content">
        <div className="columns">
          <div className="column is-10 is-offset-1">
            <h1 className="title is-size-2 has-text-weight-bold is-bold-light">
              {title}
            </h1>
            <p>{description}</p>
            <PostContent content={content} />
            
            <div className="columns is-multiline">
            {listitems &&
              listitems.map(({ node: item }) => (
                <div className="is-parent column is-6" key={item.id}>
                  <article
                    className={`blog-list-item tile is-child box notification`}
                  >
                    <header>
                      {item.frontmatter.featuredimage ? (
                        <div className="featured-thumbnail">
                          <PreviewCompatibleImage
                            imageInfo={{
                              image: item.frontmatter.featuredimage,
                              alt: `featured image thumbnail for item ${item.frontmatter.title}`,
                              width:
                                item.frontmatter.featuredimage.childImageSharp
                                  .gatsbyImageData.width,
                              height:
                                item.frontmatter.featuredimage.childImageSharp
                                  .gatsbyImageData.height,
                            }}
                          />
                        </div>
                      ) : null}
                      <p className="post-meta">
                          {item.frontmatter.title}
                      </p>
                    </header>
                    <p>
                      {item.description}
                    </p>
                  </article>
                </div>
              ))}
          </div>
            
            {tags && tags.length ? (
              <div style={{ marginTop: `4rem` }}>
                <h4>Tags</h4>
                <ul className="taglist">
                  {tags.map((tag) => (
                    <li key={tag + `tag`}>
                      <Link to={`/tags/${kebabCase(tag)}/`}>{tag}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
};

ListPostTemplate.propTypes = {
  content: PropTypes.node.isRequired,
  contentComponent: PropTypes.func,
  description: PropTypes.string,
  title: PropTypes.string,
  helmet: PropTypes.object,
};

const ListPost = ({ data }) => {
  const { markdownRemark: post } = data;

  return (
    <Layout>
      <ListPostTemplate
        content={post.html}
        contentComponent={HTMLContent}
        description={post.frontmatter.description}
        helmet={
          <Helmet titleTemplate="%s | Travel List">
            <title>{`${post.frontmatter.title}`}</title>
            <meta
              name="description"
              content={`${post.frontmatter.description}`}
            />
          </Helmet>
        }
        listitems={post.frontmatter.listitems}
        tags={post.frontmatter.tags}
        title={post.frontmatter.title}
      />
    </Layout>
  );
};

ListPost.propTypes = {
  data: PropTypes.shape({
    markdownRemark: PropTypes.object,
  }),
};

export default ListPost;

export const pageQuery = graphql`
  query ListPostByID($id: String!) {
    markdownRemark(id: { eq: $id }) {
      id
      html
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        title
        description
        listitems
        tags
      }
    }
  }
`;
