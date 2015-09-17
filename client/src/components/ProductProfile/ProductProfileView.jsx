var React = require('react/addons');
var _ = require('underscore');

var TechList = require('../sharedComponents/TechList');
var ProductFollowButton = require('./ProductFollowButton');
var ProductFavicon = require('../sharedComponents/ProductFavicon');

var UserActionCreators = require('../../actions/UserActionCreators');

var UserStore = require('../../stores/UserStore')


var ProductProfileView = React.createClass({
  getInitialState: function(){
    return {
      product_name: "",
      product_url: "",
      product_followers: '',
      product_views: '',
      Technologies: []
    }
  },

  getProductStoreState: function () {
    return ProductStore.get();
  },

  componentDidMount: function() {
    UserStore.addChangeListener(this._onChange);
    var queryString = window.location.href.split('?')[1];
    $.ajax({
      url: 'api/products/' + '?' + queryString,
      type: 'PUT',
      dataType: 'json',
      context: this,
      success: function(data) {
        // console.log('productProfileState', data);
        this.setState(data);
      },
      error: function(xhr, status, errorThrown) {
        console.log('error', errorThrown, ' status ', status);
      },
      complete: function(xhr, status) {
        // console.log('complete', status);
      }
    });
  },

  componentWillUnmount: function() {
    UserStore.removeChangeListener(this._onChange);
  },

  handleFollowClick: function() {
    UserActionCreators.userProductFollows(this.state.product_name);
  },

  _onChange: function() {
    this.setState(this.getProductStoreState())
  },

  render: function() {
    var userInfo = this.props.userState;
    var userIsFollowing = false;

    _.each(userInfo.productsFollowing, function(product) {
      if (product.product_name === this.state.product_name) {
        userIsFollowing = true;
      }
    }, this);

    var bassClass = 'btn btn-sm product-follow-button ';
    var followButton = (
      <ProductFollowButton
        class={bassClass + (userIsFollowing ? 'btn-danger' : 'btn-primary')}
        label={userIsFollowing ? 'Unfollow' : 'Follow'}
        handleClick={this.handleFollowClick}/>
    );

    var techList = <TechList techs={this.state.Technologies} />;

    var noneMessage = <span className="text-muted">none</span>;

    return (
      <div>

        <h1 className="product-profile-sitename">{this.state.product_name}</h1>

        <div className="product-item-url">

          <div className="product-profile-favicon">
            <ProductFavicon url={this.state.favicon_url} />
          </div>

          <a href={this.state.product_url}
            target="_blank"
            className="text-muted">
              {this.state.product_url}
          </a>
        </div>

        <br />

        <div>
          <span className="text-muted">Followers: {this.state.product_followers}</span>
          <br />
          <span className="text-muted">Views: {this.state.product_views}</span>
        </div>

        <br />

        {userInfo.isAuthenticated ? followButton : null}

        <br />
        <br />

        <div  className="well well-sm">
          <h3 className="product-profile-tech">Tech Stack</h3>
          {this.state.Technologies.length > 0 ? techList : noneMessage }
        </div>

      </div>
    );
  }
});

module.exports = ProductProfileView;
