import { Col, Input, Row, Select } from "antd";
import styles from './currency.module.css'
import { CODES } from "../../constants";

interface CurrencyProps {
    inputValue: number | null;
    inputDisabled?: boolean;
    selectValue: string;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSelectChange: (value: string) => void;
    hasMargin?: boolean;
}

const Currency = ({
    inputValue,
    inputDisabled = false,
    selectValue,
    onInputChange,
    onSelectChange,
    hasMargin = false
}: CurrencyProps) => {
    return(
        <Row gutter={15} className={hasMargin ? styles.rowWithMargin : ''}>
            <Col span={12}>
                <Input
                placeholder="Введите значение"
                size="large"
                type="number"
                value={inputValue === null ? undefined : inputValue}
                onChange={onInputChange}
                disabled={inputDisabled}
                />
            </Col>
            <Col span={12}>
                <Select
                showSearch
                optionFilterProp="label"
                size="large"
                placeholder="Выберите валюту"
                value={selectValue}
                options={CODES}
                onChange={onSelectChange}
                />
            </Col>
        </Row>
    )
}
export default Currency;