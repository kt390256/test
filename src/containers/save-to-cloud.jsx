import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import {projectTitleInitialState} from '../reducers/project-title';
import xhr from 'xhr';
import axios from 'axios';

/**
 * Project saver component passes a downloadProject function to its child.
 * It expects this child to be a function with the signature
 *     function (downloadProject, props) {}
 * The component can then be used to attach project saving functionality
 * to any other component:
 *
 * <SB3Downloader>{(downloadProject, props) => (
 *     <MyCoolComponent
 *         onClick={downloadProject}
 *         {...props}
 *     />
 * )}</SB3Downloader>
 */
class SaveToCloud extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'downloadProject'
        ]);
    }
    downloadProject () {


        const downloadLink = document.createElement('a');
        document.body.appendChild(downloadLink);

        this.props.saveProjectSb3().then(content => {
            if (this.props.onSaveFinished) {
                this.props.onSaveFinished();
            }

            let projectInfo = {
                title: this.props.title,
                author: this.props.author
            }

            let cur_url = window.location.href;
            let _split = cur_url.split("/");
            let project_id_index = _split[_split.length - 2] == 'editor' ? _split.length - 3 : _split.length - 2;
            let project_id = _split[project_id_index];
            console.log(_split);
            console.log(project_id);

            let formData = new FormData();
           
            //formData.append('myFile', content, `${this.props.username}-${project_id}`);
            formData.append('myFile', content, `${project_id}`);
            console.log(formData);

            axios.post('/save-to-cloud', formData, {})
            .then(res => {console.log(res)})
            .catch(err =>{console.log(err)})

            

            // axios.post('/save-project-info', projectInfo,{})
            // .then(res => console.log(res))
            // .catch(err => {console.log(err)})



        });
    }
    render () {
        const { children } = this.props;
        return children(
            this.props.className,
            this.downloadProject
        );
    }
}

const getProjectFilename = (curTitle, defaultTitle) => {
   
    let filenameTitle = curTitle;
    if (!filenameTitle || filenameTitle.length === 0) {
        filenameTitle = defaultTitle;
    }
    return `${filenameTitle.substring(0, 100)}.sb3`;
};

SaveToCloud.propTypes = {
    children: PropTypes.func,
    className: PropTypes.string,
    onSaveFinished: PropTypes.func,
    projectFilename: PropTypes.string,
    saveProjectSb3: PropTypes.func
};
SaveToCloud.defaultProps = {
    className: ''
};

const mapStateToProps = state => ({
    username: state.session.session.user.username,
    saveProjectSb3: state.scratchGui.vm.saveProjectSb3.bind(state.scratchGui.vm),
    projectFilename: getProjectFilename(state.scratchGui.projectTitle, projectTitleInitialState)
});

export default connect(
    mapStateToProps,
    () => ({}) // omit dispatch prop
)(SaveToCloud);
