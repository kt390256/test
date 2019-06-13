import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React, {Fragment} from 'react';
import {injectIntl, intlShape, defineMessages} from 'react-intl';

import decksLibraryContent from '../lib/libraries/decks/index.jsx';
import tutorialTags from '../lib/libraries/tutorial-tags';

import analytics from '../lib/analytics';
import {notScratchDesktop} from '../lib/isScratchDesktop';

import LibraryComponent from '../components/library/library.jsx';

import {connect} from 'react-redux';

import {
    closeTipsLibrary
} from '../reducers/modals';

import {
    activateDeck
} from '../reducers/cards';

const messages = defineMessages({
    tipsLibraryTitle: {
        defaultMessage: 'Choose a Tutorial',
        description: 'Heading for the help/tutorials library',
        id: 'gui.tipsLibrary.tutorials'
    }
});

class TipsLibrary extends React.PureComponent {
    constructor (props) {
        super(props);
        console.log("you are in the video section")
        bindAll(this, [
            'handleItemSelect'
        ]);
    }
    handleItemSelect (item) {
        analytics.event({
            category: 'library',
            action: 'Select How-to',
            label: item.id
        });

        /*
            Support tutorials that require specific starter projects.
            If a tutorial declares "requiredProjectId", check that the URL contains
            it. If it is not, open a new page with this tutorial and project id.

            TODO remove this at first opportunity. If this is still here after HOC2018,
                 blame Eric R. Andrew is also on record saying "this is temporary".
            UPDATE well now Paul is wrapped into this as well. Sigh...
                eventually we will find a solution that doesn't involve loading a whole project
        */
        if (item.requiredProjectId && (item.requiredProjectId !== this.props.projectId)) {
            console.log("this is being called in tips-library")
            const urlParams = `/projects/${item.requiredProjectId}/editor?tutorial=${item.urlId}`;
            consoel.log("this is urlParams",urlParams)
            return window.open(window.location.origin + urlParams, '_blank');
        }

        this.props.onActivateDeck(item.id);
    }
    render () {
        const decksLibraryThumbnailData = Object.keys(decksLibraryContent)
            .filter(id =>
                // Scratch Desktop doesn't want tutorials with `requiredProjectId`
                notScratchDesktop() || !decksLibraryContent[id].hasOwnProperty('requiredProjectId')
            )
            .map(id => ({
                rawURL: decksLibraryContent[id].img,
                id: id,
                name: decksLibraryContent[id].name,
                featured: true,
                tags: decksLibraryContent[id].tags,
                urlId: decksLibraryContent[id].urlId,
                requiredProjectId: decksLibraryContent[id].requiredProjectId,
                hidden: decksLibraryContent[id].hidden || false
            }));
            console.log("this is decksLibraryThumbnailData",decksLibraryThumbnailData);
            console.log("this is state", this.props.state);
        if (!this.props.visible) return null;
        return (
            <Fragment>
                <h1>this is shit</h1>
                <LibraryComponent
                    filterable
                    data={decksLibraryThumbnailData}
                    id="tipsLibrary"
                    tags={tutorialTags}
                    title={this.props.intl.formatMessage(messages.tipsLibraryTitle)}
                    visible={this.props.visible}
                    onItemSelected={this.handleItemSelect}
                    onRequestClose={this.props.onRequestClose}
                />
                <h1>this is shit!!!!!!!!!</h1>
            </Fragment>
        );
    }
}

TipsLibrary.propTypes = {
    intl: intlShape.isRequired,
    onActivateDeck: PropTypes.func.isRequired,
    onRequestClose: PropTypes.func,
    projectId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    visible: PropTypes.bool
};

const mapStateToProps = state => ({
    state: state,
    visible: state.scratchGui.modals.tipsLibrary,
    projectId: state.scratchGui.projectState.projectId
});

const mapDispatchToProps = dispatch => ({
    onActivateDeck: id => dispatch(activateDeck(id)),
    onRequestClose: () => dispatch(closeTipsLibrary())
});

export default injectIntl(connect(
    mapStateToProps,
    mapDispatchToProps
)(TipsLibrary));
