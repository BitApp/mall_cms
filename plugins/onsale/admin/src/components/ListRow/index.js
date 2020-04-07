/**
 *
 * ListRow
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import en from '../../translations/en.json';
import { HomePageContext } from '../../contexts/HomePage';
import { Container, ButtonWrapper, Row, Wrapper } from './Components';
import { Button } from '@buffetjs/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faLink
} from '@fortawesome/free-solid-svg-icons'

class ListRow extends React.Component {
  // eslint-disable-line react/prefer-stateless-function

  static contextType = HomePageContext;

  generateContent = () => {
    return (
      <Wrapper className="row" style={{ paddingLeft: '20px' }}>
        <div className="col-md-2">
          <b>{this.props.item.name}</b>
        </div>
        <div className="col-md-2">
          <img width="35" src={this.props.item.image.url}/>
        </div>
        <div className="col-md-5">{this.props.item.desc}</div>
        <div className="col-md-2">
          <ButtonWrapper value={this.props.item.status}>
            <Button
              color="delete"
              icon={<FontAwesomeIcon icon={faLink} />}
              onClick={({ target: { value } }) => this.props.onSale(this.props.item)}
            >
              上链
            </Button>
          </ButtonWrapper>
        </div>
      </Wrapper>
    );
  };

  render() {
    return (
      <Row onClick={this.handleClick}>
        <Container>{this.generateContent()}</Container>
      </Row>
    );
  }
}

ListRow.defaultProps = {
  item: {
    name: 'Owner',
    onSale: () => {}
  }
};

ListRow.propTypes = {
  item: PropTypes.object,
  onSale: PropTypes.func
};

export default ListRow;