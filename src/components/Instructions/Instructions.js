import React, { Component } from 'react';
import Collapsible from 'react-collapsible';

import plusCircle from '../../images/plus_circle.svg'
import minusCircle from '../../images/minus_circle.svg'
import trashIcon from '../../images/trash_icon.svg'
import undoIcon from '../../images/undo_icon.svg'

import canvasWriting from '../../images/tutorial/canvas-writing.png'

import './Instructions.css';

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            placeholder: '',
        }
    }

    render() {
        return (
            <div className="instructions-component">
                <td className="collapsible-items">
                    <Collapsible
                        trigger="How To Use This Application"
                        transitionTime={50}
                        open={true}>
                        <div className="getting-started">
                            <h5><u>Getting Started</u></h5>
                            <p>This application is able to predict the following characters from handwriting:</p>
                            <p className="center">0-9, a-z, A-Z</p>
                            <p>Simply draw some text on the canvas below, click "Predict" and see what happens.</p>
                            <p>Make sure that you:</p>
                            <ol>
                                <li>Write legibly</li>
                                <li>Write one line</li>
                                <li>Have some horizontal space between characters</li>
                            </ol>
                            
                            <img className="canvasWriting" src={canvasWriting} alt=""></img>
                            
                        </div>
                        <div className="instructions-toolbar">
                            <h5><u>Canvas Toolbar</u></h5>
                            <img className="trashIcon" src={trashIcon} alt=""></img>
                            <p>Clear canvas</p>
                            <br/>
                            <img className="undoIcon" src={undoIcon} alt=""></img>
                            <p>Undo last drawing line</p>
                            <br/>
                            <img className="minusCircle" src={minusCircle} alt=""></img>
                            <img className="plusCircle" src={plusCircle} alt=""></img>
                            <p>Resize canvas</p>
                        </div>


                    </Collapsible>
                </td>
            </div>
        )
    }
}

export default Header