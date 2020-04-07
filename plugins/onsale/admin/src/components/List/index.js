  
/**
 *
 * List
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { map, omitBy, size } from 'lodash';
import { Button, LoadingBar, LoadingIndicator } from 'strapi-helper-plugin';
import ListRow from '../ListRow';
import { Flex, ListWrapper, Title, Wrapper } from './Components';

function List({
  data,
  onSale,
  showLoaders
}) {
  const object = omitBy(data, v => v.name === 'server'); // Remove the server key when displaying providers

  return (
    <Wrapper>
      <Flex>
        <Title>
          {showLoaders ? (
            <LoadingBar style={{ marginTop: '0' }} />
          ) : (
            '商品列表'
          )}
        </Title>
      </Flex>

      <ListWrapper
        className={`${showLoaders ? 'loading-container' : ''}`}
      >
        {showLoaders ? (
          <LoadingIndicator />
        ) : (
          <ul className={'padded-list'}>
            {map(object, item => (
              <ListRow
                onSale={onSale}
                item={item}
                key={item.name}
              />
            ))}
          </ul>
        )}
      </ListWrapper>
    </Wrapper>
  );
}

List.defaultProps = {
  data: [],
  onSale: () => {},
  showLoaders: true,
};

List.propTypes = {
  data: PropTypes.array.isRequired,
  onSale: PropTypes.func,
  showLoaders: PropTypes.bool
};

export default List;