import React, {Component} from 'react';
import AdminActions from './admin-actions';
import AdminHealth from './admin-health';
import AdminInfo from './admin-info';
import '../../../styles/admin-panel.less';
import AdminImport from './admin-import';
import AdminMemoryUsage from './admin-memory-usage';
import AdminSpringBeans from './admin-spring-beans';
import AdminIdAnalyzer from './admin-id-analyzer';

export default class AdminPanel extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
  }

  render() {
    return (
      <div className="nemesis-admin-panel">
        <AdminIdAnalyzer/>
        {/*<AdminSpringBeans />*/}
        <AdminActions />
        <AdminHealth />
        <AdminInfo />
        <AdminImport />
        {/*<AdminMemoryUsage />*/}
      </div>
    );
  }
}