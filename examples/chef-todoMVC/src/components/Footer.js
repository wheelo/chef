import React from "react";
import PropTypes from "prop-types";
import { Trans, withT } from "@chef/chef-i18n";

import FilterLink from "../containers/FilterLink";
import {
  SHOW_ALL,
  SHOW_COMPLETED,
  SHOW_ACTIVE
} from "../constants/TodoFilters";

const Footer = ({
  activeCount,
  completedCount,
  onClearCompleted,
  t
}) => {
  const FILTER_TITLES = {
    [SHOW_ALL]: t("show_all_button"),
    [SHOW_ACTIVE]: t("show_active_button"),
    [SHOW_COMPLETED]: t("show_completed_button")
  };

  return (
    <footer className="footer">
      <span className="todo-count">
        {activeCount > 0 ? (
          <Trans id="items_left" data={{ num_items: activeCount }} />
        ) : (
            <Trans id="no_items_left" />
          )}
      </span>
      <ul className="filters">
        {Object.keys(FILTER_TITLES).map(filter => (
          <li key={filter}>
            <FilterLink filter={filter}>{FILTER_TITLES[filter]}</FilterLink>
          </li>
        ))}
      </ul>
      {!!completedCount && (
        <button className="clear-completed" onClick={onClearCompleted}>
          <Trans id="clear_completed_button" />
        </button>
      )}
    </footer>
  );
};

Footer.propTypes = {
  completedCount: PropTypes.number.isRequired,
  activeCount: PropTypes.number.isRequired,
  onClearCompleted: PropTypes.func.isRequired
};

export default withT(Footer);
