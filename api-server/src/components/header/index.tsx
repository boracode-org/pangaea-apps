import { Link } from "../../components/routing";
import { percent, rem } from "csx";
import * as React from "react";
import { links } from "../../routing";
import { style } from "typestyle";

const navClass = style({
  width: percent(100)
});

const listClass = style({
  listStyle: "none",
  margin: 0,
  padding: 0,
  backgroundColor: "black",
  display: "flex",
  $nest: {
    "& li": {
      float: "left",
      $nest: {
        "& a": {
          display: "block",
          minWidth: rem(1.4),
          height: rem(5),
          lineHeight: rem(5),
          color: "white",
          textDecoration: "none",
          padding: rem(1),
          $nest: {
            "&:hover": {
              backgroundColor: "purple"
            }
          }
        }
      }
    }
  }
});

export const Header = () => (
  <nav className={navClass}>
    <ul className={listClass}>
      {Object.keys(links).map(key => {
        return (
          <li>
            <Link path={links[key]().path}>{links[key]().name}</Link>
          </li>
        );
      })}

      <li>
        <Link path="/notreal">NotALink</Link>
      </li>
    </ul>
  </nav>
);
