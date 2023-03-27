# -*- coding: utf-8 -*-
from .utils import (filter_out_result,
                    is_stream,
                    name_parser_factory,
                    no_return,
                    Param,
                    remove_subscribe,
                    type_info_factory)


class Method(object):
    """ Method """

    def __init__(
            self,
            plugin_name,
            package,
            is_server,
            method_description,
            pb_method,
            requests,
            responses):
        self._is_stream = False
        self._no_return = False
        self._has_result = False
        self._returns = False
        self._plugin_name = name_parser_factory.create(plugin_name)
        self._package = name_parser_factory.create(package)
        self._is_server = is_server
        self._method_description = method_description
        self._name = name_parser_factory.create(pb_method.name)
        self.extract_params(pb_method, requests)
        self.extract_return_type_and_name(pb_method, responses)
        self.extract_async_type(pb_method)
        self.extract_is_finite(pb_method)

    def extract_params(self, pb_method, requests):
        method_input = pb_method.input_type.split(".")[-1]
        request = requests[method_input]['struct']
        params_description = requests[method_input]['docs']['params']

        self._params = []

        field_id = 0
        for field in request.field:
            self._params.append(
                Param(
                    name=name_parser_factory.create(field.name),
                    type_info=type_info_factory.create(field),
                    description=params_description[field_id])
            )

            field_id += 1

    def extract_return_type_and_name(self, pb_method, responses):
        method_output = pb_method.output_type.split(".")[-1]
        response = responses[method_output]['struct']
        response_docs = responses[method_output]['docs']

        return_params = list(
            filter_out_result(
                response.field,
                response_docs['params']))

        if len(return_params) < len(response.field):
            self._has_result = True

        if len(return_params) > 1:
            raise Exception(
                "Responses cannot have more than 1 return parameter" +
                f" (and an optional '*Result')!\nError in {method_output}")

        if len(return_params) == 1:
            self._return_type = type_info_factory.create(
                return_params[0]['field'])
            self._return_name = name_parser_factory.create(
                return_params[0]['field'].json_name)
            self._return_description = return_params[0]['docs']
        elif len(return_params) == 0 and self.return_type_required:
            raise Exception(
                "This response must have 1 return parameter" +
                f" (and an optional '*Result')!\nError in {method_output}")

    def extract_async_type(self, pb_method):
        self._is_sync = True
        self._is_async = True

        for option_line in pb_method.options.__str__().splitlines():
            if "[mavsdk.options.async_type]" in option_line:
                async_type = option_line.split(':')[-1].strip()

                if async_type == "SYNC":
                    self._is_async = False
                elif async_type == "ASYNC":
                    self._is_sync = False

    def extract_is_finite(self, pb_method):
        self._is_finite = False

        for method_descriptor in pb_method.options.Extensions:
            if method_descriptor.name == "is_finite":
                self._is_finite = pb_method.options.Extensions[method_descriptor]

    @property
    def is_stream(self):
        return self._is_stream

    @property
    def no_return(self):
        return self._no_return

    @property
    def returns(self):
        return self._returns

    @property
    def plugin_name(self):
        return self._plugin_name

    @property
    def package(self):
        return self._package

    @property
    def is_server(self):
        return self._is_server

    @property
    def name(self):
        return self._name

    @property
    def return_type_required(self):
        return False

    @staticmethod
    def collect_methods(
            plugin_name,
            package,
            is_server,
            docs,
            methods,
            structs,
            requests,
            responses,
            template_env):
        """ Collects all methods for the plugin """
        _methods = {}

        method_id = 0
        for method in methods:
            # Extract method description
            method_description = docs['methods'][method_id].strip()

            # Check if stream
            if (is_stream(method)):
                _methods[method.name] = Stream(plugin_name,
                                               package,
                                               is_server,
                                               method_description,
                                               template_env,
                                               method,
                                               requests,
                                               responses)

            # Check if method is just a call
            elif (no_return(method, responses)):
                _methods[method.name] = Call(plugin_name,
                                             package,
                                             is_server,
                                             method_description,
                                             template_env,
                                             method,
                                             requests,
                                             responses)

            else:
                _methods[method.name] = Request(plugin_name,
                                                package,
                                                is_server,
                                                method_description,
                                                template_env,
                                                method,
                                                requests,
                                                responses)

            method_id += 1

        return _methods

    def __repr__(self):
        return "method: {}".format(self._name)


class Call(Method):
    """ A call method doesn't return any value, but either succeeds or fails
    """

    def __init__(
            self,
            plugin_name,
            package,
            is_server,
            method_description,
            template_env,
            pb_method,
            requests,
            responses):
        super().__init__(
            plugin_name,
            package,
            is_server,
            method_description,
            pb_method,
            requests,
            responses)
        self._template = template_env.get_template("call.j2")
        self._no_return = True

    def __repr__(self):
        return self._template.render(name=self._name,
                                     params=self._params,
                                     plugin_name=self._plugin_name,
                                     package=self._package,
                                     is_server=self._is_server,
                                     method_description=self._method_description,
                                     has_result=self._has_result,
                                     is_async=self._is_async,
                                     is_sync=self._is_sync)


class Request(Method):
    """ Requests a value """

    def __init__(
            self,
            plugin_name,
            package,
            is_server,
            method_description,
            template_env,
            pb_method,
            requests,
            responses):
        super().__init__(
            plugin_name,
            package,
            is_server,
            method_description,
            pb_method,
            requests,
            responses)
        self._template = template_env.get_template("request.j2")
        self._method_description = method_description
        self._returns = True

    def __repr__(self):
        return self._template.render(
            name=self._name,
            params=self._params,
            return_type=self._return_type,
            return_name=self._return_name,
            return_description=self._return_description,
            plugin_name=self._plugin_name,
            package=self._package,
            is_server=self.is_server,
            method_description=self._method_description,
            has_result=self._has_result,
            is_async=self._is_async,
            is_sync=self._is_sync)


class Stream(Method):
    """ A stream of values """

    def __init__(
            self,
            plugin_name,
            package,
            is_server,
            method_description,
            template_env,
            pb_method,
            requests,
            responses):
        super().__init__(
            plugin_name,
            package,
            is_server,
            method_description,
            pb_method,
            requests,
            responses)
        self._is_stream = True
        self._name = name_parser_factory.create(
            remove_subscribe(pb_method.name))
        self._template = template_env.get_template("stream.j2")

    @property
    def return_type_required(self):
        return True

    def __repr__(self):
        return self._template.render(
            name=self._name,
            params=self._params,
            return_type=self._return_type,
            return_name=self._return_name,
            return_description=self._return_description,
            plugin_name=self._plugin_name,
            package=self._package,
            is_server=self._is_server,
            method_description=self._method_description,
            has_result=self._has_result,
            is_async=self._is_async,
            is_sync=self._is_sync,
            is_finite=self._is_finite)
