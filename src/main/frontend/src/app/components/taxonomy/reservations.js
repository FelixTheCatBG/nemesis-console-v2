import React, { Component, useState, useRef } from 'react';
import Translate from "react-translate-component";
import Select from "react-select";
import NemesisEntityField from "../field-components/nemesis-entity-field/nemesis-entity-field";
import ApiCall from "servicesDir/api-call";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { componentRequire } from "../../utils/require-util";
import "react-big-calendar/lib/css/react-big-calendar.css";
import NotificationSystem from "react-notification-system";
import '../../../styles/taxonomy-panel.less';
import ConsolePopup from "../../custom-components/backend-console-popup";

moment.locale("en-GB");
let NemesisHeader = componentRequire('app/components/nemesis-header/nemesis-header', 'nemesis-header');

const ReservationCalendar = ({ productReservationObject, date, handleNavigate, onEventClick }) => (
    <div style={{ height: 700, padding: '10px' }}>
        <Calendar
            selectable
            onSelectEvent={event => onEventClick(event)}
            events={productReservationObject}
            defaultDate={new Date()}
            localizer={momentLocalizer(moment)}
            date={date}
            onNavigate={handleNavigate}
        />
    </div>
);

const allowedReservationEntities = ['product'];
const reservationTypeDefaultValue = { value: 'product', label: 'ProductEntity' };

export default class ProductReservations extends Component {
    constructor(props) {
        super(props);
        this.notificationSystem = null;
        this.state = {
            selectedReservationType: null,
            selectedProduct: null,
            reservationTypes: [],
            productReservations: [],
            showModal: false,
            selectedItemId: null
        }
    }

    componentDidMount() {
        ApiCall.get("subtypes/abstract_taxonomable_entity")
            .then(result => {
                this.setState({ reservationTypes: result.data });
            });
        this.notificationSystem = this.refs.notificationSystem;
    };

    getOptions = () => {
        return this.state.reservationTypes
            .filter(reservationType => allowedReservationEntities.includes(reservationType.id))
            .map(reservationType => {
                return { value: reservationType.id, label: reservationType.text };
            });
    };

    handleNewReservationTypeChange = (item) => {
        this.setState({ selectedReservationType: item });
    };

    onProductSelect = (product) => {
        if (!product) {
            this.setState({ selectedProduct: null, productReservations: [] });
            return;
        }
        this.setState({
            isLoading: true,
            selectedProduct: product
        }, () => {
            this.getProductReservation(product.id);
        });
    };

    getProductReservation = (selectedProductId) => {
        ApiCall.get(`reservable_cart_entry/search/findByProduct?product=${selectedProductId}`)
            .then(result => {
                if (!result.data || !result.data._embedded || !result.data._embedded.reservable_cart_entry.length) {
                    this.setState({
                        isLoading: false,
                        productReservations: [],
                    }, () => this.openNotificationSnackbar('No Reservation found!', 'error'));
                } else {
                    this.setState({
                        isLoading: false,
                        date: result.data._embedded.reservable_cart_entry.reservationFrom,
                        productReservations: result.data._embedded.reservable_cart_entry
                    });
                }
            })
            .catch(err => {
                this.setState({
                    isLoading: false,
                    productReservations: [],
                }, () => this.openNotificationSnackbar('No Reservation found!', 'error'));
            })
    };

    handleNavigate = (date, view, action) => {
        this.setState({ date: moment(date).toDate() })
    };

    openNotificationSnackbar = (message, level) => {
        this.notificationSystem.addNotification({
            message: message,
            level: level || "success",
            position: "tc"
        });
    };

    onEventClick = (event) => {
        console.log(event);
        this.setState({ selectedItemId: event.id, showModal: true });
    };

    render() {
        return (
            <div>
                <NemesisHeader onRightIconButtonClick={() => { }} isOpenInFrame={this.isOpenInFrame} />
                <div className="nemesis-taxonomy-panel">
                    <div className="taxon-configuration">
                        <div className="entity-field-container">
                            <div className="entity-field-input-container">
                                <div>
                                    <Translate
                                        component="label"
                                        content={"main.ReservationType"}
                                        fallback="ReservationType"
                                    />
                                </div>
                                <Select
                                    className="entity-field"
                                    value={{
                                        value:
                                            this.state.selectedReservationType !== null
                                                ? this.state.selectedReservationType.value
                                                : reservationTypeDefaultValue.value,
                                        label:
                                            this.state.selectedReservationType != null
                                                ? this.state.selectedReservationType.label
                                                : reservationTypeDefaultValue.label
                                    }}
                                    onChange={item => this.handleNewReservationTypeChange(item)}
                                    options={this.getOptions()}
                                />
                            </div>
                        </div>
                        <NemesisEntityField
                            entityId={"product"}
                            onValueChange={this.onProductSelect}
                            value={this.state.selectedReservationType}
                            label={"Product"}
                            catalogVersionCode={'Online'}
                        />
                        <div className="calendar-container">
                            <ReservationCalendar productReservationObject={this.state.productReservations
                                ? this.state.productReservations.map(product => ({
                                    'title': this.state.selectedProduct && this.state.selectedProduct.code,
                                    'allDay': true,
                                    'start': new Date(moment(product.reservationFrom, 'DD/MM/YYYY').format('YYYY, MM, DD')),
                                    'end': new Date(moment(product.reservationTo, 'DD/MM/YYYY').format('YYYY, MM, DD')),
                                    'id': product.id
                                }))
                                : []
                            }
                                date={this.state.date ? new Date(moment(this.state.date).format('YYYY/MM/DD')) : new Date()}
                                handleNavigate={this.handleNavigate}
                                onEventClick={this.onEventClick}
                            />
                        </div>
                    </div>
                </div>
                <NotificationSystem ref="notificationSystem" />
                {(this.state.showModal && this.state.selectedItemId) && (
                    <ConsolePopup
                        open={this.state.showModal}
                        itemId={this.state.selectedItemId && this.state.selectedItemId}
                        entityId="cart_entry"
                        entityName="cart_entry"
                        onClose={() =>
                            this.setState({ showModal: false, selectedItemId: null })
                        }
                    />
                )}
            </div>
        )
    }
}