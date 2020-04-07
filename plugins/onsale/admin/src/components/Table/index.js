import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Table, Button } from '@buffetjs/core';
import { LoadingBar, LoadingIndicator } from 'strapi-helper-plugin';
import { Flex, Title, TableWrapper, ButtonWrapper, Wrapper } from './Components.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faLink
} from '@fortawesome/free-solid-svg-icons'

const CustomRow = ({ row }) => {
  const { name, desc, image, status, startTime, onSale } = row;
  return (
    <tr>
      <td>
        <p>{name}</p>
      </td>
      <td>
        <p>{desc}</p>
      </td>
      <td>
        <p><img width="35" src={image?image.url:''}/></p>
      </td>
      <td>
        <p>{status}</p>
      </td>
      <td>
        <p>{moment(startTime).format("YYYY-MM-DD HH:mm:ss")}</p>
      </td>
      <td>
        {status === 'offline' && <Button
          color="delete"
          icon={<FontAwesomeIcon icon={faLink} />}
          onClick={ () => onSale(row) }
        >
        上链
        </Button>}
        {status !== 'offline' && <p>已上链</p>}
      </td>
    </tr>
  );
};

const headers = [
  {
    name: '商品',
    value: 'name',
  },
  {
    name: '描述',
    value: 'desc'
  },
  {
    name: '图片',
    value: 'image'
  },
  {
    name: '状态',
    value: 'status'
  },
  {
    name: '开始时间',
    value: 'startTime'
  }
];

function ProductTable({
  data,
  onSale,
  showLoaders
}) {
  data.forEach(item => {
    item.onSale = onSale
  })
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
      <TableWrapper
        className={`${showLoaders ? 'loading-container' : ''}`}
      >
        {showLoaders ? (
            <LoadingIndicator />
          ) : (
        <Table
          customRow={ CustomRow }
          headers={ headers }
          rows={ data }
          rowLinks={[
            {
              icon: <FontAwesomeIcon icon={faLink} />,
              onClick: data => {
              },
            },
          ]}
        /> )}
      </TableWrapper>
    </Wrapper>
  );
}

ProductTable.defaultProps = {
  data: [],
  onSale: () => {},
  showLoaders: true,
};

ProductTable.propTypes = {
  data: PropTypes.array.isRequired,
  onSale: PropTypes.func,
  showLoaders: PropTypes.bool
};

export default ProductTable;