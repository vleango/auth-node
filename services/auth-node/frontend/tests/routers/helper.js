export const mockComponent = () => (<div>component</div>);

export const getRouteElements = (routes) => {
  const elements = routes.reduce((element, route) => {
    const routeProps = route.props();
    if(typeof routeProps.component().props.children !== 'undefined') {
      routeProps.component().props.children.forEach((child) => {
        if(typeof child.type.displayName !== 'undefined') {
          // redux connected component
          element.push(child.type.displayName);
        }
        else {
          // regular component
         element.push(child.type);
        }
      });
    }
    else {
      // handle Redirect case
      element.push(routeProps.component().props.to);
    }
    return element;
  }, []);
  return elements.toString();
}
