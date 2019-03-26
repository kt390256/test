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
            console.log("THis is content:", content)
            if (this.props.onSaveFinished) {
                this.props.onSaveFinished();
            }

            let project_data = {
                projectName: this.props.ProjectFilename,
                content: content
            }

            let formData = new FormData();
            formData.append('myFile', content, "someshit.sb3");

            axios.post('/save-to-cloud', formData, {
               
            })
            .then(res => {console.log(response)})
            .catch(err =>{console.log(err)})




            // Use special ms version if available to get it working on Edge.
            if (navigator.msSaveOrOpenBlob) {
                navigator.msSaveOrOpenBlob(content, this.props.projectFilename);
                return;
            }

            // const url = window.URL.createObjectURL(content);//create an url refer to the object
            // console.log("url:", url);
            // downloadLink.href = url;
            // downloadLink.download = this.props.projectFilename;
            // console.log("projectFIlename:", downloadLink.download);
            // downloadLink.click();//simulate a click
            // window.URL.revokeObjectURL(url);//destroy the reference that was used previously
            // document.body.removeChild(downloadLink);//remove the previously added downloadLink from the DOM
        });
    }
    render () {
        const {
            children
        } = this.props;
        return children(
            this.props.className,
            this.downloadProject
        );
    }
}

const getProjectFilename = (curTitle, defaultTitle) => {
    console.log("curTitile:", curTitle);
    console.log("defaultTitle:", defaultTitle);
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
    saveProjectSb3: state.scratchGui.vm.saveProjectSb3.bind(state.scratchGui.vm),
    projectFilename: getProjectFilename(state.scratchGui.projectTitle, projectTitleInitialState)
});

export default connect(
    mapStateToProps,
    () => ({}) // omit dispatch prop
)(SaveToCloud);
