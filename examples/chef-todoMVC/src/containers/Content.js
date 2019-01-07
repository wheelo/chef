import { connect, bindActionCreators } from '@chef/chef-redux';

import Content from "../components/Content";
import * as TodoActions from "../actions";
import { getCompletedTodoCount } from "../selectors";


const mapStateToProps = state => {
  return {
    todosCount: state.todos.length,
    completedCount: getCompletedTodoCount(state)
  };
}

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(TodoActions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Content);
